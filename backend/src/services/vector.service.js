// Import the Pinecone library
const { Pinecone } =  require('@pinecone-database/pinecone') 

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });


const sudaiIndex = pc.index('sudai')

async function creatMemory({vectors, metadata, messageId}){

    await sudaiIndex.upsert([{
        id : messageId,
        values: vectors,
        metadata
    }]) 
}

async function queryMemory({queryVector, limit=5, metadata} ){
    const data = await sudaiIndex.query({
        vector : queryVector,
        topK : limit,
        filter : metadata || undefined,
        includeMetadata : true
    })
    return data.matches
}


module.exports = {
    creatMemory,
    queryMemory
}