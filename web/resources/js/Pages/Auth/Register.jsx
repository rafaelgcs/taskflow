import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { UserPlus, LayoutDashboard } from 'lucide-react';
import GuestLayout from '@/Layouts/GuestLayout';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="text-center mb-8">
                <LayoutDashboard size={48} className="text-purple-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold mb-2 text-gray-100">TaskFlow</h1>
                <p className="text-gray-400">Crie seu perfil de usuário</p>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300">
                        Nome de Usuário
                    </label>
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:ring-purple-500 rounded-xl"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        placeholder="Ex: Rafael"
                    />
                    <InputError message={errors.name} className="mt-2 text-pink-400" />
                </div>

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
                        onChange={(e) => setData('email', e.target.value)}
                        required
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
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                        placeholder="Crie uma senha"
                    />
                    <InputError message={errors.password} className="mt-2 text-pink-400" />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300">
                        Confirmar Senha
                    </label>
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:ring-purple-500 rounded-xl"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                        placeholder="Repita a senha"
                    />
                    <InputError message={errors.password_confirmation} className="mt-2 text-pink-400" />
                </div>

                <button 
                    type="submit" 
                    disabled={processing}
                    className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-purple-500/25 disabled:opacity-50"
                >
                    <UserPlus size={20} /> Cadastrar e Entrar
                </button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-white/10">
                <p className="text-gray-400 text-sm">
                    Já possui uma conta?{' '}
                    <Link
                        href={route('login')}
                        className="text-purple-400 hover:text-purple-300 font-semibold background-transparent"
                    >
                        Fazer Login
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
