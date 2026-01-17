"use client";

import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

export default function Loading() {
    return (
        <div className="fixed inset-0 bg-[#faf9f6]/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <motion.div
                    animate={{
                        rotate: 360,
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="relative"
                >
                    <div className="w-16 h-16 bg-[#2d5016]/10 rounded-full flex items-center justify-center">
                        <Leaf className="w-8 h-8 text-[#2d5016]" />
                    </div>
                    <div className="absolute inset-0 border-t-2 border-[#2d5016] rounded-full" />
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                    className="text-[#2d5016] font-medium font-serif"
                >
                    Loading...
                </motion.p>
            </div>
        </div>
    );
}
