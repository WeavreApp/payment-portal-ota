export async function hashFile(file: File): Promise<string> {
  try {
    // Try modern crypto API first
    if (window.crypto && window.crypto.subtle) {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
    
    // Fallback for browsers without crypto.subtle support
    throw new Error('Crypto API not available');
  } catch (error) {
    console.warn('Crypto hashing failed, using fallback:', error);
    
    // Simple fallback hash for mobile compatibility
    // This is less secure but ensures the payment process works
    const fallbackHash = await simpleHash(file);
    return fallbackHash;
  }
}

async function simpleHash(file: File): Promise<string> {
  // Create a simple hash based on file properties and content
  const text = await file.text();
  const combined = file.name + file.size + file.type + text.slice(0, 1000); // First 1000 chars
  
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to hex string
  return Math.abs(hash).toString(16).padStart(32, '0').slice(0, 32);
}
