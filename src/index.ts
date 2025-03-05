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
    console.log("run")
    let aqua = new Aquafier();
    let file: FileObject = {
        fileName: "test.txt",
        fileContent: "hwllo world",
        path: "./"
    }
    let res = await aqua.createGenesisRevision(file)

    if (res.isOk()) {
        console.log("Genesis created")
        console.log(JSON.stringify(res.data, null, 4))
        console.log("=================================================\n\n")
        let data = res.data;
        let res2 = await aqua.verifyAquaTree(data.aquaTree!!, [file])
        if (res2.isOk()) {
            console.log("Verified")
            // Read credentials.json
            const credentialsData: CredentialsData = JSON.parse(fs.readFileSync('./credentials.json', 'utf-8'));

            let aquatreewrapper = {
                aquaTree: data.aquaTree!!,
                revision: ``
            } as AquaTreeWrapper;

            // Use the mnemonic from credentials
            let signRes = await aqua.signAquaTree(aquatreewrapper, `cli`, credentialsData, true);
            
            console.log(JSON.stringify(res2.data.aquaTree, null, 4))
            try {
                // Get the current directory path
                const currentDir = new URL('.', import.meta.url).pathname;
                console.log("Current directory:", currentDir);

                // Write the aquaTree to a file 
                const filePath = `${currentDir}test.txt.aqua.json`;
                console.log(`File successfully written to: ${filePath}`);
                fs.writeFileSync(filePath, JSON.stringify(res2.data.aquaTree, null, 4))

                // Write the original file to a file    
                const filePath2 = `${currentDir}test.txt`;
                fs.writeFileSync(filePath2, file.fileContent as string)
                console.log(`File successfully written to: ${filePath2}`);
            } catch (e: any) {
                console.error("Error writing file:", e);
                if (e.code === 'ENOENT') {
                    console.error("Directory does not exist");
                }
                if (e.code === 'EACCES') {
                    console.error("Permission denied");
                }
            }
            console.log(JSON.stringify(res2.data.aquaTree, null, 4))
        }
    }
}

// Execute the main function
console.log("🌊 Aquafier Demo Application");
console.log("============================");
run().catch(err => {
    console.error("❌ Unhandled error in application:", err);
    process.exit(1);
});