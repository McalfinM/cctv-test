// Function to create a simple hash from a string
const simpleHash = (str) => {
    let hash = 0;
    if (str.length === 0) return hash.toString();
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
};

// Function to create a SHA-256 hash from a string
const sha256 = async (message) => {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
};

// Function to encode JSON and store in localStorage
const set = async (name, data) => {
    const jsonString = JSON.stringify(data);

    // First, hash using simpleHash
    const simpleHashValue = simpleHash(jsonString);
    console.log("🚀 ~ file: storage.js:28 ~ set ~ simpleHashValue:", simpleHashValue)

    // Then, hash using SHA-256
    const sha256Hash = await sha256(simpleHashValue);
    console.log("🚀 ~ file: storage.js:31 ~ set ~ sha256Hash:", sha256Hash)

    localStorage.setItem(name, sha256Hash);
};

// Function to retrieve and decode JSON from localStorage
const get = async (name, originalJsonObj) => {
    const storedHash = localStorage.getItem(name);
    if (storedHash) {
        const jsonString = JSON.stringify(originalJsonObj);
        const simpleHashValue = simpleHash(jsonString);
        const calculatedHash = await sha256(simpleHashValue);
        if (storedHash === calculatedHash) {
            return originalJsonObj; // If hash matches, return the original JSON object
        } else {
            throw new Error("Hash mismatch: Data may be corrupted.");
        }
    }
    return null;
};

// const get = (name) => {
//     let data = localStorage.getItem(name);
//     if (data?.length) return JSON.parse(data)
//     else return undefined
// };

const clear = (navigate) => {
    localStorage.clear();
    if (navigate) navigate('/login');
};


const Storage = {
    set,
    get,
    clear
};

export default Storage;