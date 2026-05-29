// app/login/page.tsx
import { Suspense } from 'react';
import LoginContent from './LoginContent';
import LoadingBar from '@/components/ui/LoadingBar';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <LoadingBar />
    }>
      <LoginContent />
    </Suspense>
  );
}