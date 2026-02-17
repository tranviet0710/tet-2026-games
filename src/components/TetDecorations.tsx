const TetDecorations = () => {
  return (
    <>
      {/* Floating lanterns */}
      <div className="fixed top-0 left-4 z-0 opacity-20 pointer-events-none">
        <div className="animate-sway text-6xl">🏮</div>
      </div>
      <div className="fixed top-0 right-4 z-0 opacity-20 pointer-events-none" style={{ animationDelay: '1s' }}>
        <div className="animate-sway text-5xl" style={{ animationDelay: '1.5s' }}>🏮</div>
      </div>
      
      {/* Cherry blossoms */}
      <div className="fixed top-20 left-1/4 z-0 opacity-10 pointer-events-none">
        <span className="text-4xl animate-sparkle">🌸</span>
      </div>
      <div className="fixed top-40 right-1/3 z-0 opacity-10 pointer-events-none">
        <span className="text-3xl animate-sparkle" style={{ animationDelay: '0.7s' }}>🌸</span>
      </div>
      
      {/* Bottom pattern */}
      <div className="fixed bottom-0 left-0 right-0 h-2 tet-gold-gradient z-0 opacity-60" />
    </>
  );
};

export default TetDecorations;
