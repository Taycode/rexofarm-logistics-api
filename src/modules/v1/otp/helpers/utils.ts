export function generateOtp(length:number): string {
  const chars = '0123456789';
  let result = '';
  for (let i = 0; i < length; i + 1) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }

  // wantend to use a package for this but yarn is not allowing me to install
  // might be my network though
  return result;
}
