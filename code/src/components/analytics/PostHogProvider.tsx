'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';
// import { Env } from '@/libs/Env';
import { SuspendedPostHogPageView } from './PostHogPageView';

export const PostHogProvider = (props: { children: React.ReactNode }) => {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        capture_pageview: false, // Disable automatic pageview capture, as we capture manually
        capture_pageleave: true, // Enable pageleave capture
      });
    }
  }, []);

  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return props.children;
  }

  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {props.children}
    </PHProvider>
  );
};
