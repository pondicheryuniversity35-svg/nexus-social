import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Story } from "../../data/mockData";

interface Props {
  stories: Story[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function StoryViewer({
  stories,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: Props) {
  const story = stories[currentIndex];
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          onNext();
          return 0;
        }
        return p + 2;
      });
    }, 100);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onNext]);

  if (!story) return null;

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: story overlay closes on click
    <div
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      onClick={onClose}
    >
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: stop propagation on inner */}
      <div
        className="relative w-full max-w-sm h-full max-h-screen"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
          {stories.map((s, i) => (
            <div
              key={s.id}
              className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{
                  width:
                    i < currentIndex
                      ? "100%"
                      : i === currentIndex
                        ? `${progress}%`
                        : "0%",
                }}
              />
            </div>
          ))}
        </div>

        <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-10 pt-2">
          <div className="flex items-center gap-2">
            <img
              src={story.avatar}
              alt=""
              className="w-8 h-8 rounded-full border border-white/30"
            />
            <div>
              <p className="text-white text-sm font-semibold">
                {story.displayName}
              </p>
              <p className="text-white/60 text-xs">@{story.username}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <img
          src={story.image}
          alt="Story"
          className="w-full h-full object-cover"
        />

        {currentIndex > 0 && (
          <button
            type="button"
            onClick={onPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white z-10"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        )}
        {currentIndex < stories.length - 1 && (
          <button
            type="button"
            onClick={onNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white z-10"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        )}
      </div>
    </div>
  );
}
