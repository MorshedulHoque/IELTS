// app/listening-tests/[id]/page.tsx

"use client";
import { useParams } from 'next/navigation';
import listeningTests from '../../../../../data/listening.json';
import ListeningTest from '@/components/TestComponent/listeningTest/ListeningTest';
import Link from 'next/link';
import { getListeningTestById } from '@/services/data';
import { useEffect, useState } from 'react';
import Loader from '@/components/Common/Loader';

export default function ListeningTestPage() {
    const params = useParams();
    const testId = params.id as string;

    const [listeningData, setListeningData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getListeningTestById(testId);
                setListeningData(data.data);
            } catch (err) {
                console.error("Error loading data:", err);
                setError(err instanceof Error ? err.message : "Failed to load data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    console.log('testId', testId)
    console.log("Listening", listeningData)

    if (isLoading) {
        return (
            <Loader message="Loading listening test..." />
        );
    }

    if (!listeningData || listeningData.length === 0) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl text-error">Test not found</h1>
                <Link href="/test/listening" className="btn btn-primary mt-4">
                    Back to Tests
                </Link>
            </div>
        );
    }

    return <ListeningTest test={listeningData} />;
}