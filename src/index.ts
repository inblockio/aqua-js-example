import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { SignType } from 'aquafier-js-sdk';
import { AquaTreeWrapper } from 'aquafier-js-sdk';
import { CredentialsData } from 'aquafier-js-sdk';
// Add this if using ES modules
const __dirname = dirname(fileURLToPath(import.meta.url));

import Aquafier, { FileObject } from "aquafier-js-sdk"
import fs from "fs"
import { stdin } from 'process';

/**
 * Main function that demonstrates the Aquafier SDK workflow:
 * 1. Create a genesis revision for a file
 * 2. Verify the aqua tree
 * 3. Sign the aqua tree using credentials
 * 4. Write the results to disk
 */
async function run() {
    console.log("🚀 Starting Aquafier demo process...")
    
    // Initialize the Aqua SDK
    let aqua = new Aquafier();
    
    // Define a test file to be processed
    let file: FileObject = {
        fileName: "test.txt",
        fileContent: "Hello Aqua",
        path: "./"
    }
    
    console.log("📄 Processing file:", file.fileName);
    
    // Step 1: Create a genesis revision for our test file
    console.log("⏳ Creating genesis revision...");
    let res = await aqua.createGenesisRevision(file)

    if (res.isOk()) {
        console.log("✅ Genesis revision created successfully!");
        
        // Display a summary of the genesis data
        console.log("\n📊 Genesis Data Summary:");
        console.log("  Tree Info:", res.data.aquaTree ? "Available" : "Not available");
        // Safely access properties that might exist on the AquaTree object
        // without causing TypeScript errors
        
        // Print a separator for readability
        console.log("\n" + "=".repeat(50) + "\n");
        
        let data = res.data;
        
        // Step 2: Verify the aqua tree with our file
        console.log("⏳ Verifying aqua tree...");
        let res2 = await aqua.verifyAquaTree(data.aquaTree!!, [file])
        
        if (res2.isOk()) {
            console.log("✅ Aqua tree verification successful!");
            
            // Step 3: Read credentials and sign the aqua tree
            console.log("⏳ Reading credentials and signing aqua tree...");
            try {
                // Read credentials from the file system
                const credentialsData: CredentialsData = JSON.parse(fs.readFileSync('./credentials.json', 'utf-8'));
                console.log("✅ Credentials loaded successfully");
    
                // Prepare the aqua tree wrapper for signing
                let aquatreewrapper = {
                    aquaTree: data.aquaTree!!,
                    revision: ``
                } as AquaTreeWrapper;
    
                // Sign the aqua tree using the credentials
                console.log("⏳ Signing aqua tree...");
                let signRes = await aqua.signAquaTree(aquatreewrapper, `cli`, credentialsData, true);
                console.log("✅ Aqua tree signed successfully");
                
                // Step 4: Write the results to disk
                console.log("\n⏳ Writing results to disk...");
                
                try {
                    // Get the current directory path
                    const currentDir = new URL('.', import.meta.url).pathname;
                    
                    // Write the aqua tree to a JSON file
                    const aquaTreePath = `${currentDir}test.txt.aqua.json`;
                    fs.writeFileSync(aquaTreePath, JSON.stringify(res2.data.aquaTree, null, 2));
                    console.log(`✅ Aqua tree written to: ${aquaTreePath}`);
    
                    // Write the original file content
                    const originalFilePath = `${currentDir}test.txt`;
                    fs.writeFileSync(originalFilePath, file.fileContent as string);
                    console.log(`✅ Original file written to: ${originalFilePath}`);
                    
                } catch (e: any) {
                    console.error("❌ Error writing files:");
                    console.error(`   - Code: ${e.code}`);
                    console.error(`   - Message: ${e.message}`);
                    
                    // Provide more helpful context based on error codes
                    if (e.code === 'ENOENT') {
                        console.error("   - Directory does not exist. Please create it first.");
                    }
                    if (e.code === 'EACCES') {
                        console.error("   - Permission denied. Check your file system permissions.");
                    }
                }
            } catch (e: any) {
                console.error("❌ Error processing credentials:", e.message);
            }
        } else {
            // Access error information safely through the result object's methods
            // instead of directly accessing a property that might not exist
            console.error("❌ Aqua tree verification failed");
            // Use appropriate method to get error details instead of res2.error
        }
    } else {
        console.error("❌ Failed to create genesis revision");
        // Use appropriate method to get error details instead of res.error
    }
}

// Execute the main function
console.log("🌊 Aquafier Demo Application");
console.log("============================");
run().catch(err => {
    console.error("❌ Unhandled error in application:", err);
    process.exit(1);
});