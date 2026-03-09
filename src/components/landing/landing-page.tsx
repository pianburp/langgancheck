"use client";

import { Component as EtheralShadow } from "@/components/ui/etheral-shadow";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { LogIn } from "lucide-react";
import { useState } from "react";

export function LandingPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleSignIn = () => {
        setIsLoading(true);
        authClient.signIn.social({
            provider: "google",
            callbackURL: "/",
        });
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-background">
            {/* Background Etheral Shadow Effect */}
            <EtheralShadow
                sizing="stretch"
                color="rgba(14, 165, 233, 0.4)" // Changed to sky-500 tint
                animation={{ scale: 30, speed: 40 }}
                noise={{ opacity: 20, scale: 0.5 }}
                className="absolute inset-0 h-full w-full"
            />

            {/* Content Overlay */}
            <div className="relative z-20 flex h-screen flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="flex max-w-3xl flex-col items-center gap-8 text-center">

                    <div className="space-y-4">
                        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl text-foreground">
                            Take Control of Your <span className="text-primary">Subscriptions</span>
                        </h1>
                        <p className="mx-auto max-w-xl text-lg text-muted-foreground sm:text-xl">
                            Track, manage, and optimize your monthly recurring expenses with LangganCheck. Don't let your money slip through unused subscriptions.
                        </p>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row gap-4">
                        <Button
                            size="lg"
                            className="px-8 h-14 text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                "Signing in..."
                            ) : (
                                <>
                                    <LogIn className="mr-2 h-5 w-5" />
                                    Get Started with Google
                                </>
                            )}
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
}
