import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { LogIn, LayoutDashboard } from 'lucide-react';
import GuestLayout from '@/Layouts/GuestLayout';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-400">
                    {status}
                </div>
            )}

            <div className="text-center mb-8">
                <LayoutDashboard size={48} className="text-purple-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold mb-2 text-gray-100">TaskFlow</h1>
                <p className="text-gray-400">Acesse seu painel</p>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300">
                        Email
                    </label>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:ring-purple-500 rounded-xl"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="Ex: rafael@taskflow.com"
                    />
                    <InputError message={errors.email} className="mt-2 text-pink-400" />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300">
                        Senha
                    </label>
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:ring-purple-500 rounded-xl"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="••••••••"
                    />
                    <InputError message={errors.password} className="mt-2 text-pink-400" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded border-gray-700 bg-gray-900 text-purple-500 shadow-sm focus:ring-purple-500"
                        />
                        <span className="ms-2 text-sm text-gray-400">Lembrar de mim</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-purple-400 hover:text-purple-300 focus:outline-none"
                        >
                            Esqueceu a senha?
                        </Link>
                    )}
                </div>

                <button 
                    type="submit" 
                    disabled={processing}
                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-purple-500/25 disabled:opacity-50"
                >
                    <LogIn size={20} /> Entrar no Painel
                </button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-white/10">
                <p className="text-gray-400 text-sm">
                    Ainda não tem conta local?{' '}
                    <Link
                        href={route('register')}
                        className="text-purple-400 hover:text-purple-300 font-semibold background-transparent"
                    >
                        Criar Conta
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
