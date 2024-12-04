// src/components/firstVisitToast.tsx
"use client";

import { useEffect } from "react";
import { useFirstVisit } from "@/hooks/useFirstVisit";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

export const FirstVisitToast = () => {
  const { toast } = useToast();
  const isFirstVisit = useFirstVisit();

  useEffect(() => {
    if (isFirstVisit) {
      toast({
        title: "Looking for a talented developer?",
        description: "Connect with Syed Huzaifa",
        variant: "default",
        action: (
          <a
            href="https://www.linkedin.com/in/syed-huzaifa-bukhari-b866421b3/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-100"
          >
            <Send />
          </a>
        ),
        duration: 7000,
        className: "bg-cyan-700 text-white",
      });
    }
  }, [isFirstVisit, toast]);

  return null;
};
