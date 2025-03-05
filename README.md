# Aquafier Demo Application

## Overview

This application demonstrates the core functionality of the Aquafier JavaScript SDK for managing content provenance. It showcases how to create, verify, and sign content using Aqua trees - a cryptographic data structure that enables content verification and tracking.

## What This Demo Does

The application performs the following operations:

1. **Genesis Revision Creation**: Establishes the initial state of a file in the Aqua system
2. **Aqua Tree Verification**: Validates that the file matches its cryptographic representation
3. **Credential Loading**: Reads authentication credentials from a local file
4. **Aqua Tree Signing**: Cryptographically signs the Aqua tree to establish authenticity
5. **Post-Signature Verification**: Confirms the tree integrity after signing
6. **Result Serialization**: Writes both the original file and its Aqua tree JSON to disk

## Setup Requirements

To run this demo, you'll need:

1. Node.js (v14 or newer recommended)
2. A local copy of the aquafier-js-sdk (https://github.com/inblockio/aqua-js-sdk or installed from npm)
3. A valid `credentials.json` file in the project root with the required authentication data

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. If using a local copy of the SDK:
   ```bash
   # In the SDK directory
   npm link
   
   # In this project directory
   npm link aquafier-js-sdk
   ```

3. Create a `credentials.json` file with your authentication details

4. Build and run the application:
   ```bash
   npm run build
   npm start
   ```

## Output

When successful, the application will:
- Display progress information in the console
- Create a `test.txt` file with the demo content
- Create a `test.txt.aqua.json` file containing the Aqua tree data

## What is Aquafier?

Aquafier provides tools for establishing and verifying digital content provenance. The system creates cryptographic proofs that can verify file authenticity, track changes, and establish ownership through signatures.

## Next Steps

After understanding this demo, you can:
- Integrate Aquafier into your own applications
- Build more complex workflows with multiple file revisions
- Create verification systems that use Aqua trees to validate content authenticity
