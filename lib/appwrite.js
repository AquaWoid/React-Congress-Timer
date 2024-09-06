import { Client, Databases} from 'appwrite';

const client = new Client();
const DatabaseID = "66d85f9600336f249ac9";
const CollectionID = "66d85fb0003a77229516";
const DocumentID = "66d863cb00209c93d9f8";

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('66d85db600125423b8ed');


export const databases = new Databases(client);
export {DatabaseID, CollectionID, DocumentID, client}