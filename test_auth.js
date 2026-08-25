const authHeader = 'Bearer admin123';
const parts = authHeader.split(' ');
const token = (parts.length > 1 ? parts[1] : parts[0]).trim();
console.log({token});
