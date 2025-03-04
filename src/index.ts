import Aquafier, { FileObject } from "aquafier-js-sdk"


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
            console.log(JSON.stringify(res2.data, null, 4))
        }
    }
}


run()