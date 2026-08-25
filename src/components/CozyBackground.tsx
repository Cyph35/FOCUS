export default function CozyBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Warm ambient diffuse orbs */}
      <div 
        className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-br from-amber-200/20 via-orange-100/15 to-transparent blur-3xl animate-float opacity-70 dark:opacity-20" 
      />
      <div 
        className="absolute top-[30%] -right-[15%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full bg-gradient-to-bl from-[#E8E3D9]/40 via-amber-100/20 to-transparent blur-3xl animate-float-reverse opacity-80 dark:opacity-20" 
      />
      <div 
        className="absolute -bottom-[10%] left-[20%] w-[45vw] h-[45vw] max-w-[550px] max-h-[550px] rounded-full bg-gradient-to-t from-orange-100/20 via-[#F4F0E6]/30 to-transparent blur-3xl animate-float opacity-60 dark:opacity-15" 
      />
      
      {/* Subtle fine warm noise texture / grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.018] dark:opacity-[0.03] mix-blend-overlay bg-[radial-gradient(#594A42_1px,transparent_1px)] [background-size:24px_24px]" 
      />
    </div>
  );
}
