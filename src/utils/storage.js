// Function to generate a cryptographic key
const generateKey = async () => {
    return crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256
        },
        true,
        ["encrypt", "decrypt"]
    );
};

// Function to encrypt JSON string
const encryptJson = async (jsonString, dd) => {
    
    const encoder = new TextEncoder();
    const data = encoder.encode(jsonString);
    const iv = crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
    const encryptedData = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        dd,
        data
    );
    return { encryptedData, iv };
};

// Function to decrypt JSON string
const decryptJson = async (encryptedData, iv, dd) => {
    const decryptedData = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        dd,
        encryptedData
    );
    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
};

// Function to store encrypted JSON in localStorage
// const set = async (name, jsonObj, key) => {
//     let xssx = await generateKey()
//     console.log("🚀 ~ set ~ key:", xssx)
//     const { encryptedData, iv } = await encryptJson(jsonString, key);
//     const encryptedArray = Array.from(new Uint8Array(encryptedData));
//     const ivArray = Array.from(iv);
//     localStorage.setItem(name, JSON.stringify({ encryptedArray, ivArray }));
// };

// // Function to retrieve and decrypt JSON from localStorage
// const get = async (name, key) => {
//     const storedData = localStorage.getItem(name);
//     console.log("🚀 ~ get ~ storedData:", storedData)
//     if (storedData) {
//         const { encryptedArray, ivArray } = JSON.parse(storedData);
//         const encryptedData = new Uint8Array(encryptedArray);
//         const iv = new Uint8Array(ivArray);
//         const jsonString = await decryptJson(encryptedData.buffer, iv, key);
//         return JSON.parse(jsonString);
//     }
//     return null;
// };

// Example of setting and getting JSON with encryption

const get = (name) => {
    let data = localStorage.getItem(name);
    if (data?.length) return JSON.parse(data)
    else return ''
};

const token = () => {
  return get('user')?.token || ''
};

const set = (name, data) => {
   localStorage.setItem(name, JSON.stringify(data));
};

const clear = (navigate) => {
    localStorage.clear();
    if (navigate) navigate('/login');
};

const Storage = {
    set,
    get,
    clear,
    generateKey, 
    token
};

export default Storage;