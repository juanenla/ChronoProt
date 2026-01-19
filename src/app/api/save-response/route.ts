/**
 * ChronoPro - Save Response API
 * POST /api/save-response
 * 
 * Guarda la respuesta del usuario en Supabase para analytics
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { createHash } from 'crypto';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Hash de IP para analytics (no guardamos IP real)
        const forwarded = request.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
        const ipHash = createHash('sha256').update(ip + process.env.SUPABASE_SERVICE_ROLE_KEY).digest('hex').slice(0, 16);

        const userAgent = request.headers.get('user-agent') || null;

        const { error } = await supabaseAdmin
            .from('user_responses')
            .insert({
                chronotype: body.chronotype,
                training_time: body.trainingTime,
                frequency: body.frequency,
                diet: body.diet,
                experience: body.experience,
                supplements: body.supplements || [],
                goal: body.goal,
                ip_hash: ipHash,
                user_agent: userAgent,
                plan_generated: body.plan || null
            } as any);

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: 'Failed to save response' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error saving response:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
