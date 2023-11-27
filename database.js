
const knex = require('knex');
require('dotenv').config();
const db = knex({
    client: 'pg',
    connection: {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE,
    },
});

const getNodes = async () => {
    try {
        // Using knex to select data
        const results = await db.select('*').from('nodes');

        if (results.length === 0) {
            throw new Error("No results found");
        }

        return results;
    } catch (error) {
        console.error(error);
        throw new Error("Internal server Error");
    }
};
const getEdges = async () => {
    try {
        // Using knex to select data
        const results = await db.select('*').from('edges');

        if (results.length === 0) {
            throw new Error("No results found");
        }

        return results;
    } catch (error) {
        console.error(error);
        throw new Error("Internal server Error");
    }
};
const getEdgesByEntityId = async (entityId) => {
    try {
        // Using knex to select data by entity ID
        const results = await db.select('*').from('edges').where('entity-id', entityId);

        if (results.length === 0) {
            throw new Error("No edges found for the given entity ID");
        }

        return results;
    } catch (error) {
        console.error(error);
        throw new Error("Internal server error");
    }
};
const getChildNodesNamesByEntityId = async (entityId) => {
    try {
        // Using knex to select child IDs from the "edges" table based on the provided entityId
        const childNodes = await db('edges')
            .where('entity-id', entityId)
            .select('child');

        if (childNodes.length === 0) {
            throw new Error(`No child nodes found for entity_id: ${entityId}`);
        }

        // Extract the child IDs from the query result
        const childIds = childNodes.map((node) => node.child);

        // Using knex to fetch the "names" from the "nodes" table for the extracted child IDs
        const childNodesNames = await db('nodes')
            .whereIn('uuid', childIds)
            .select('names');

        if (childNodesNames.length === 0) {
            throw new Error(`No child node names found for entity_id: ${entityId}`);
        }

        return childNodesNames;
    } catch (error) {
        console.error(error);
        throw new Error("Internal server error");
    }
};

const createNodes = async (body) => {
    try {
        const { names } = body; // Extracting 'names' from the body

        // Inserting data into the 'nodes' table using Knex
        const results = await db('nodes')
                            .insert({
                                names: names
                            })
                            .returning('*'); // This line ensures that the inserted record is returned

        if (results.length === 0) {
            throw new Error("No results found or no insert made");
        }

        return `A new node has been added: ${JSON.stringify(results[0])}`;
    } catch (error) {
        console.error(error);
        throw new Error("Internal server Error");
    }
};

  //delete a merchant
  const deleteNodes = async (uuid) => {
    try {
        // Perform the delete operation using Knex
        const results = await db('nodes')
                            .where('uuid', '=', uuid)
                            .del(); // 'del' is used for DELETE operations

        // Check if any row was actually deleted
        if (results === 0) {
            throw new Error(`No node found with ID: ${uuid}`);
        }

        return `Node deleted with ID: ${uuid}`;
    } catch (error) {
        console.error(error);
        throw new Error("Internal server Error");
    }
};

  //update a node record
  const updateNodes = async (uuid, body) => {
    try {
        const { names } = body; // Assuming 'names' is the field to be updated

        // Perform the update operation using Knex
        const results = await db('nodes')
                            .where('uuid', '=', uuid)
                            .update({
                                names: names
                            })
                            .returning('*'); // This line ensures that the updated record is returned

        if (results.length === 0) {
            throw new Error("No results found or no update made");
        }

        return `Node updated: ${JSON.stringify(results[0])}`;
    } catch (error) {
        console.error(error);
        throw new Error("Internal server Error");
    }
};


  module.exports = {
    getNodes,
    createNodes,
    deleteNodes,
    updateNodes,
    getChildNodesNamesByEntityId,
    getEdges,
    getEdgesByEntityId
   
  };
 