"use client";

import {
    Activity,
    ChevronDown,
    Cpu,
    Gauge,
    HardDrive,
    Monitor,
    Route,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { disableDevMode } from "@/store/AppConfigReducer";
import { useDispatch } from "react-redux";

interface Timings {
  dns: number;
  tcp: number;
  ttfb: number;
  domReady: number;
  loadTime: number;
}

interface RouteEntry {
  path: string;
  renderMs: number;
}

interface MemoryInfo {
  used: string;
  total: string;
  pct: number;
}
function Metric({
    label,
    value,
    className = "",
}: {
  label: string;
  value: string | number;
  className?: string;
}) {
    return (
        <div className="flex justify-between py-0.5">
            <span className="text-slate-400">
                {label}
            </span>

            <span
                className={`font-mono font-semibold ${className}`}
            >
                {value}
            </span>
        </div>
    );
}

export default function PerformanceMonitor() {
    const dispatch = useDispatch();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const route = useMemo(() => {
        const qs = searchParams.toString();
        return qs ? `${pathname}?${qs}` : pathname;
    }, [
        pathname, searchParams
    ]);

    const [
        collapsed, setCollapsed
    ] = useState(false);

    const [
        timings, setTimings
    ] = useState<Timings>({
        dns: 0,
        tcp: 0,
        ttfb: 0,
        domReady: 0,
        loadTime: 0,
    });

    const [
        fps, setFps
    ] = useState(0);

    const [
        resolution, setResolution
    ] = useState("");

    const [
        memory, setMemory
    ] = useState<MemoryInfo | null>(null);

    const [
        navCount, setNavCount
    ] = useState(0);

    const [
        rootHistory, setHistory
    ] = useState<RouteEntry[]>([
    ]);

    const frameRef = useRef(0);
    const lastTimeRef = useRef(0);

    useEffect(() => {
        const saved =
      localStorage.getItem("perf-monitor-collapsed") === "true";

        setCollapsed(saved);
    }, [
    ]);

    const toggle = () => {
        if (!collapsed) {
            dispatch(disableDevMode());
        }
        const next = !collapsed;
        
        setCollapsed(next);

        localStorage.setItem(
            "perf-monitor-collapsed",
            String(next)
        );
    };

    useEffect(() => {
        const nav =
      performance.getEntriesByType(
          "navigation"
      )[ 0 ] as PerformanceNavigationTiming;

        if (!nav) return;

        setTimings({
            dns: Math.round(
                nav.domainLookupEnd - nav.domainLookupStart
            ),
            tcp: Math.round(
                nav.connectEnd - nav.connectStart
            ),
            ttfb: Math.round(
                nav.responseStart - nav.requestStart
            ),
            domReady: Math.round(
                nav.domContentLoadedEventEnd
            ),
            loadTime: Math.round(nav.loadEventEnd),
        });
    }, [
    ]);

    useEffect(() => {
        lastTimeRef.current = performance.now();

        let raf = 0;

        const loop = () => {
            frameRef.current++;

            const now = performance.now();

            if (now - lastTimeRef.current >= 1000) {
                setFps(
                    Math.round(
                        (frameRef.current * 1000) /
            (now - lastTimeRef.current)
                    )
                );

                frameRef.current = 0;
                lastTimeRef.current = now;
            }

            raf = requestAnimationFrame(loop);
        };

        raf = requestAnimationFrame(loop);

        return () => {
            return cancelAnimationFrame(raf); 
        };
    }, [
    ]);

    // -----------------------------
    // Memory
    // -----------------------------
    useEffect(() => {
        const timer = setInterval(() => {
            const perf = performance as any;

            if (!perf.memory) return;

            const used =
        perf.memory.usedJSHeapSize /
        1024 /
        1024;

            const total =
        perf.memory.totalJSHeapSize /
        1024 /
        1024;

            setMemory({
                used: used.toFixed(2),
                total: total.toFixed(2),
                pct: Math.round((used / total) * 100),
            });
        }, 1000);

        return () => {
            return clearInterval(timer); 
        };
    }, [
    ]);

    // -----------------------------
    // Screen size
    // -----------------------------
    useEffect(() => {
        const update = () => {
            setResolution(
                `${window.innerWidth} × ${window.innerHeight}`
            );
        };

        update();

        window.addEventListener("resize", update);

        return () => {
            return window.removeEventListener(
                "resize",
                update
            ); 
        };
    }, [
    ]);

    // -----------------------------
    // Route render tracking
    // -----------------------------
    useEffect(() => {
        const start = performance.now();

        let cancelled = false;

        const complete = () => {
            if (cancelled) return;

            const renderMs = Math.round(
                performance.now() - start
            );

            setHistory((prev) => {
                return [
                    { path: route, renderMs },
                    ...prev.slice(0, 4),
                ]; 
            });

            setNavCount((prev) => {
                return prev + 1; 
            });
        };

        const id = requestAnimationFrame(() => {
            requestAnimationFrame(complete);
        });

        return () => {
            cancelled = true;
            cancelAnimationFrame(id);
        };
    }, [
        route
    ]);

    const fpsColor =
    fps >= 55
        ? "text-green-400"
        : fps >= 30
            ? "text-yellow-400"
            : "text-red-400";

    const memoryColor =
    memory?.pct && memory.pct > 85
        ? "bg-red-500"
        : memory?.pct && memory.pct > 60
            ? "bg-yellow-500"
            : "bg-green-500";

    if (collapsed) {
        return (
            <button
                onClick={toggle}
                className="
          fixed bottom-6 right-6 z-[99999]
          h-12 w-12 rounded-full
          bg-slate-900/90
          text-cyan-400
          shadow-xl
          backdrop-blur
          flex items-center justify-center
          hover:scale-105 transition
        "
            >
                <Activity size={20} />
            </button>
        );
    }

    return (
        <div
            className="
        fixed bottom-6 right-6 z-[99999]
        w-[340px]
        rounded-2xl
        border border-white/10
        bg-slate-950/90
        backdrop-blur-xl
        text-slate-100
        shadow-2xl
      "
        >
            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2">
                    <Gauge
                        size={18}
                        className="text-cyan-400"
                    />
                    <span className="text-xs font-bold tracking-wider">
            PERFORMANCE
                    </span>
                </div>

                <button
                    onClick={toggle}
                    className="rounded p-1 hover:bg-white/10"
                >
                    <ChevronDown size={18} />
                </button>
            </div>

            <div className="space-y-4 p-4 text-xs">
                {/* NETWORK */}

                <section>
                    <div className="mb-2 flex items-center gap-2 text-cyan-400">
                        <Cpu size={14} />
                        <span>Network</span>
                    </div>

                    <Metric
                        label="DNS"
                        value={`${timings.dns} ms`}
                    />
                    <Metric
                        label="TCP"
                        value={`${timings.tcp} ms`}
                    />
                    <Metric
                        label="TTFB"
                        value={`${timings.ttfb} ms`}
                    />
                    <Metric
                        label="DOM Ready"
                        value={`${timings.domReady} ms`}
                    />
                    <Metric
                        label="Load"
                        value={`${timings.loadTime} ms`}
                    />
                </section>

                {/* MEMORY */}

                {memory && (
                    <section>
                        <div className="mb-2 flex items-center gap-2 text-cyan-400">
                            <HardDrive size={14} />
                            <span>Memory</span>
                        </div>

                        <Metric
                            label="Heap"
                            value={`${memory.used} MB / ${memory.total} MB`}
                        />

                        <div className="mt-2 h-2 overflow-hidden rounded bg-slate-800">
                            <div
                                className={`h-full ${memoryColor}`}
                                style={{
                                    width: `${memory.pct}%`,
                                }}
                            />
                        </div>
                    </section>
                )}

                {/* RENDER */}

                <section>
                    <div className="mb-2 flex items-center gap-2 text-cyan-400">
                        <Monitor size={14} />
                        <span>Rendering</span>
                    </div>

                    <Metric
                        label="FPS"
                        value={fps}
                        className={fpsColor}
                    />

                    <Metric
                        label="Screen"
                        value={resolution}
                    />
                </section>

                {/* ROUTES */}

                <section>
                    <div className="mb-2 flex items-center gap-2 text-cyan-400">
                        <Route size={14} />
                        <span>
              Route History ({navCount})
                        </span>
                    </div>

                    {rootHistory.map((item, index) => {
                        return (
                            <div
                                key={`${item.path}-${index}`}
                                className="mb-1 flex items-center justify-between"
                            >
                                <span className="truncate text-slate-400 max-w-[220px]">
                                    {item.path}
                                </span>

                                <span
                                    className={
                                        item.renderMs < 50
                                            ? "text-green-400"
                                            : item.renderMs < 200
                                                ? "text-yellow-400"
                                                : "text-red-400"
                                    }
                                >
                                    {item.renderMs} ms
                                </span>
                            </div>
                        ); 
                    })}
                </section>
            </div>
        </div>
    );
}
