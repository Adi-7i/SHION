import { AIModel } from '@/lib/server/config/models';
import { useState, useEffect } from 'react';

export const useModels = () => {
    const [models, setModels] = useState<AIModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchModels = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/models');
                if (!res.ok) throw new Error('Failed to fetch models');

                const data = await res.json();
                setModels(data.models || []);
                setError(null);
            } catch (err) {
                console.error('Error fetching available models:', err);
                setError('Failed to load available models');
            } finally {
                setLoading(false);
            }
        };

        fetchModels();
    }, []);

    return { models, loading, error };
};
