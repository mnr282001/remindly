'use client'

import { useState, useEffect } from 'react'

export default function AnimatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes blob {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          @keyframes float {
            0%, 100% {
              transform: translateY(0px) translateX(0px);
              opacity: 0.4;
            }
            50% {
              transform: translateY(-20px) translateX(10px);
              opacity: 0.6;
            }
          }
          @keyframes grid {
            0% { transform: translateY(0); }
            100% { transform: translateY(80px); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          .animate-grid {
            animation: grid 20s linear infinite;
          }
          .animation-delay-1000 {
            animation-delay: 1s;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-3000 {
            animation-delay: 3s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          .animation-delay-5000 {
            animation-delay: 5s;
          }
          .animation-delay-6000 {
            animation-delay: 6s;
          }
        `
      }} />

      {/* Complex layered background */}
      <div className="fixed inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-blue-900/30"></div>

        {/* Animated gradient orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"></div>
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-pink-600/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-indigo-600/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-6000"></div>
        </div>

        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>

        {/* Animated grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,.03)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_90%)] animate-grid"></div>

        {/* Diagonal lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(139,92,246,.4)_49%,rgba(139,92,246,.4)_51%,transparent_52%)] bg-[size:60px_60px]"></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          <div className="absolute top-[10%] left-[10%] w-2 h-2 bg-purple-400 rounded-full animate-float opacity-40"></div>
          <div className="absolute top-[20%] right-[20%] w-1 h-1 bg-blue-400 rounded-full animate-float animation-delay-1000 opacity-30"></div>
          <div className="absolute top-[60%] left-[15%] w-1.5 h-1.5 bg-pink-400 rounded-full animate-float animation-delay-2000 opacity-40"></div>
          <div className="absolute top-[40%] right-[15%] w-2 h-2 bg-indigo-400 rounded-full animate-float animation-delay-3000 opacity-30"></div>
          <div className="absolute bottom-[20%] left-[25%] w-1 h-1 bg-purple-400 rounded-full animate-float animation-delay-4000 opacity-40"></div>
          <div className="absolute bottom-[30%] right-[30%] w-1.5 h-1.5 bg-blue-400 rounded-full animate-float animation-delay-5000 opacity-30"></div>
        </div>
      </div>

      {/* Animated mesh gradient that follows mouse */}
      <div
        className="fixed inset-0 opacity-20 transition-all duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.15), transparent 50%)`
        }}
      ></div>
    </>
  )
}
