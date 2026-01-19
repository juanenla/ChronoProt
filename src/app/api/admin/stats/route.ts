/**
 * ChronoPro - Admin Stats API
 * GET /api/admin/stats
 * 
 * Estadísticas agregadas para el dashboard admin
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
    try {
        // TODO: Verificar autenticación admin
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Total de respuestas
        const { count: total } = await supabaseAdmin
            .from('user_responses')
            .select('*', { count: 'exact', head: true });

        // Respuestas últimas 24h
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { count: last24h } = await supabaseAdmin
            .from('user_responses')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', yesterday);

        // Distribución por cronotipo
        const { data: byChronotype } = await supabaseAdmin
            .from('user_responses')
            .select('chronotype');

        const safeChronotypeData = byChronotype || [];

        const chronotypeStats = {
            morning: safeChronotypeData.filter((r: any) => r.chronotype === 'morning').length,
            intermediate: safeChronotypeData.filter((r: any) => r.chronotype === 'intermediate').length,
            evening: safeChronotypeData.filter((r: any) => r.chronotype === 'evening').length
        };

        // Distribución por dieta
        const { data: byDiet } = await supabaseAdmin
            .from('user_responses')
            .select('diet');

        const dietStats: Record<string, number> = {};
        (byDiet || []).forEach((r: any) => {
            dietStats[r.diet] = (dietStats[r.diet] || 0) + 1;
        });

        return NextResponse.json({
            success: true,
            stats: {
                total: total || 0,
                last24h: last24h || 0,
                byChronotype: chronotypeStats,
                byDiet: dietStats
            }
        });

    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
