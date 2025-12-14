
import { Message } from '../types';

const STORAGE_KEY = 'nexus_omni_memory_v1';
const DRIVE_FILE_NAME = 'nexus_omni_memory.json';

// --- Local Storage Service ---
export const loadLocalMemory = (): Message[] => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error("Local Memory Corruption Detected:", e);
        return [];
    }
};

export const saveLocalMemory = (messages: Message[]) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
        console.error("Failed to write to Local Memory Core:", e);
    }
};

export const clearLocalMemory = () => {
    localStorage.removeItem(STORAGE_KEY);
};

// --- Google Drive Service (Client Side) ---

// NOTE: In a real production app, these would come from environment variables.
// The user needs to supply their own Client ID to enable real Drive sync.
// Since we cannot securely distribute a Client ID, this code structure expects one to be set
// or it handles the missing ID gracefully by just logging.
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || ''; 
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY || ''; // Optional for some calls
const SCOPES = 'https://www.googleapis.com/auth/drive.file';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

let tokenClient: any;
let gapiInited = false;
let gisInited = false;

export const initGoogleDrive = async (
    onSuccess: () => void, 
    onError: (err: any) => void
) => {
    if (!CLIENT_ID) {
        console.warn("NEXUS::CLOUD_LINK // No Client ID provided. Cloud sync simulation only.");
        return;
    }

    const gapiLoadPromise = new Promise<void>((resolve, reject) => {
        (window as any).gapi.load('client', async () => {
            try {
                await (window as any).gapi.client.init({
                    apiKey: API_KEY,
                    discoveryDocs: [DISCOVERY_DOC],
                });
                gapiInited = true;
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    });

    const gisLoadPromise = new Promise<void>((resolve, reject) => {
        try {
            tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: SCOPES,
                callback: async (resp: any) => {
                    if (resp.error !== undefined) {
                        onError(resp);
                        throw (resp);
                    }
                    onSuccess();
                },
            });
            gisInited = true;
            resolve();
        } catch (err) {
            reject(err);
        }
    });

    return Promise.all([gapiLoadPromise, gisLoadPromise]);
};

export const signInToDrive = () => {
    if (tokenClient) {
        tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
        console.warn("Token Client not initialized. Missing Client ID?");
    }
};

export const saveToDrive = async (messages: Message[]) => {
    if (!gapiInited) return;

    try {
        const content = JSON.stringify(messages);
        const file = new Blob([content], { type: 'application/json' });
        const metadata = {
            name: DRIVE_FILE_NAME,
            mimeType: 'application/json',
        };

        const accessToken = (window as any).gapi.client.getToken()?.access_token;
        if (!accessToken) return;

        // 1. Check if file exists
        const response = await (window as any).gapi.client.drive.files.list({
            q: `name = '${DRIVE_FILE_NAME}' and trashed = false`,
            fields: 'files(id, name)',
        });

        const files = response.result.files;

        if (files && files.length > 0) {
            // Update existing file
            const fileId = files[0].id;
            await updateFile(fileId, file, accessToken);
            console.log("NEXUS::CLOUD_LINK // Memory Updated in Drive.");
        } else {
            // Create new file
            await createFile(metadata, file, accessToken);
            console.log("NEXUS::CLOUD_LINK // Memory Created in Drive.");
        }
    } catch (err) {
        console.error("Cloud Sync Error:", err);
    }
};

const createFile = async (metadata: any, file: Blob, accessToken: string) => {
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
        body: form,
    });
};

const updateFile = async (fileId: string, file: Blob, accessToken: string) => {
    // For simple update of content only (media)
    await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
        method: 'PATCH',
        headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
        body: file,
    });
};
