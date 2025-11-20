"use client";

import { useState, useEffect } from "react";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";
import { Button } from "@/components/ui/button";

const fruits = ["Apple", "Banana", "Cherry", "Lemon"];
const fruitImages: Record<string, string> = {
  Apple: "/apple.png",
  Banana: "/banana.png",
  Cherry: "/cherry.png",
  Lemon: "/lemon.png",
};

export function SlotMachine() {
  const [grid, setGrid] = useState<string[][]>(
    Array.from({ length: 3 }, () => Array(3).fill("Apple"))
  );
  const [spinning, setSpinning] = useState(false);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const interval = setInterval(() => {
      setGrid((prev) => {
        const newGrid = prev.map((col) => [...col]);
        for (let c = 0; c < 3; c++) {
          for (let r = 2; r > 0; r--) {
            newGrid[c][r] = newGrid[c][r - 1];
          }
          newGrid[c][0] = fruits[Math.floor(Math.random() * fruits.length)];
        }
        return newGrid;
      });
    }, 200);
    setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
    }, 2000);
  };

  const winner = !spinning && (() => {
    // check rows
    for (let r = 0; r < 3; r++) {
      const first = grid[0][r];
      if (grid[1][r] === first && grid[2][r] === first) return first;
    }
    // check columns
    for (let c = 0; c < 3; c++) {
      const first = grid[c][0];
      if (grid[c][1] === first && grid[c][2] === first) return first;
    }
    return null;
  })();

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.map((col, cIdx) =>
          col.map((fruit, rIdx) => (
            <div
              key={`${cIdx}-${rIdx}`}
              className="w-20 h-20 flex items-center justify-center border rounded"
            >
              <img
                src={fruitImages[fruit]}
                alt={fruit}
                className="w-16 h-16"
              />
            </div>
          ))
        )}
      </div>
      <Button onClick={spin} disabled={spinning} variant="outline">
        {spinning ? "Spinning..." : "Spin"}
      </Button>
      {winner && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-xl font-semibold">
            You won with {winner}s!
          </span>
          <Share text={`You won with ${winner}s! ${url}`} />
        </div>
      )}
    </div>
  );
}
