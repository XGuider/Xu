import { SignIn } from '@clerk/nextjs';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'Auth.sign_in' });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function Page(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="fixed top-0 right-0 left-0 z-50 border-b border-gray-300 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 transition-opacity hover:opacity-80">
              <Image
                src="/assets/images/logo.png"
                alt="Xu Logo"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
              <div className="text-2xl font-bold text-blue-600">Xu</div>
            </Link>

            {/* 右侧操作区域 */}
            <div className="flex items-center space-x-4">
              <LocaleSwitcher />
              <Link href="/sign-up">
                <button type="button" className="font-medium text-gray-700 transition-colors duration-200 hover:text-blue-600">
                  注册
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <div className="flex flex-col justify-center py-12 pt-24 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="flex items-center space-x-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
                <span className="text-2xl font-bold text-white">X</span>
              </div>
              <div className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-3xl font-bold text-transparent">
                Xu AI
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900">欢迎回来</h2>
            <p className="mt-2 text-sm text-gray-600">登录您的账户以继续使用AI工具导航平台</p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="rounded-2xl border border-gray-100 bg-white px-6 py-10 shadow-xl">
            <SignIn
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-sm font-medium normal-case rounded-lg shadow-sm transition-all duration-200',
                  card: 'shadow-none border-none',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden',
                  socialButtonsBlockButton: 'bg-white border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 text-sm font-medium normal-case rounded-lg transition-all duration-200',
                  formFieldInput: 'border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200',
                  footerActionLink: 'text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200',
                  formFieldLabel: 'text-gray-700 font-medium',
                  identityPreviewText: 'text-gray-600',
                  formFieldInputShowPasswordButton: 'text-gray-400 hover:text-gray-600',
                  dividerLine: 'bg-gray-200',
                  dividerText: 'text-gray-500 text-sm',
                  formFieldSuccessText: 'text-green-600 text-sm',
                  formFieldErrorText: 'text-red-600 text-sm',
                  formFieldWarningText: 'text-yellow-600 text-sm',
                  alertText: 'text-sm',
                  formHeaderTitle: 'text-2xl font-bold text-gray-900 text-center',
                  formHeaderSubtitle: 'text-gray-600 text-center',
                  footerActionText: 'text-gray-600 text-sm',
                  footerActionLink: 'text-blue-600 hover:text-blue-700 font-medium',
                  formResendCodeLink: 'text-blue-600 hover:text-blue-700 text-sm',
                  otpCodeFieldInput: 'border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg text-center font-mono text-lg',
                  formFieldHintText: 'text-gray-500 text-sm',
                  formFieldInputShowPasswordIcon: 'text-gray-400',
                  formFieldInputHidePasswordIcon: 'text-gray-400',
                  identityPreviewEditButton: 'text-blue-600 hover:text-blue-700',
                  formFieldRow: 'space-y-1',
                  formField: 'space-y-1',
                  formFields: 'space-y-4',
                  formFieldInputGroup: 'space-y-1',
                  formFieldInputGroupInput: 'border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg',
                  formFieldInputGroupLabel: 'text-gray-700 font-medium',
                  formFieldInputGroupSuccessText: 'text-green-600 text-sm',
                  formFieldInputGroupErrorText: 'text-red-600 text-sm',
                  formFieldInputGroupWarningText: 'text-yellow-600 text-sm',
                  formFieldInputGroupHintText: 'text-gray-500 text-sm',
                  formFieldInputGroupInputShowPasswordButton: 'text-gray-400 hover:text-gray-600',
                  formFieldInputGroupInputShowPasswordIcon: 'text-gray-400',
                  formFieldInputGroupInputHidePasswordIcon: 'text-gray-400',
                  formFieldInputGroupInputShowPasswordButton: 'text-gray-400 hover:text-gray-600',
                  formFieldInputGroupInputShowPasswordIcon: 'text-gray-400',
                  formFieldInputGroupInputHidePasswordIcon: 'text-gray-400',
                },
              }}
              redirectUrl="/dashboard"
              signUpUrl="/sign-up"
            />
          </div>

          {/* 底部链接 */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              还没有账户？
              {' '}
              <a href="/sign-up" className="font-medium text-blue-600 transition-colors duration-200 hover:text-blue-500">
                立即注册
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
