import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 bg-red-50 min-h-screen flex flex-col items-center justify-center text-center">
                    <h1 className="text-3xl font-bold text-red-600 mb-4">¡Algo salió mal!</h1>
                    <p className="text-gray-700 mb-4">Se produjo un error crítico en la aplicación.</p>
                    <div className="bg-white p-4 rounded shadow border border-red-200 text-left max-w-2xl overflow-auto">
                        <p className="font-mono text-sm text-red-500 font-bold mb-2">
                            {this.state.error && this.state.error.toString()}
                        </p>
                        <p className="text-sm text-gray-500">
                            Revisa la consola del navegador (F12) para más detalles.
                        </p>
                    </div>
                    <button
                        className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        onClick={() => window.location.reload()}
                    >
                        Recargar Página
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
