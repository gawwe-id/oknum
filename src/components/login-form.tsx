'use client';

import { SignIn } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('redirect_url');

  const fallbackUrl = returnUrl ? decodeURIComponent(returnUrl) : '/overview';

  return (
    <div
      className={cn('flex flex-col items-center justify-center', className)}
      {...props}
    >
      <SignIn
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'shadow-none'
          }
        }}
        routing="path"
        path="/login"
        signUpUrl="/signup"
        fallbackRedirectUrl={fallbackUrl}
      />
    </div>
  );
}
