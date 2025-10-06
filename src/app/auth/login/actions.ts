'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    const supabase = createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error, data: authData } = await supabase.auth.signInWithPassword(data)

    if (error) {
        return { error: error.message }
    }

    if (!authData.user) {
        return { error: 'No user data returned' }
    }

    // Get user role and onboarding status
    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role, onboarding_completed, onboarding_step')
        .eq('id', authData.user.id)
        .single()

    // If user doesn't exist in users table, create them
    if (userError && userError.code === 'PGRST116') {
        console.log('User record not found, creating...')

        // Create user record
        const { error: createError } = await supabase
            .from('users')
            .insert({
                id: authData.user.id,
                email: authData.user.email,
                full_name: authData.user.user_metadata?.full_name || authData.user.email?.split('@')[0],
                role: 'student',
                onboarding_completed: false,
                onboarding_step: 1
            })

        if (createError) {
            console.error('Error creating user record:', createError)
        }

        // Create student profile
        await supabase
            .from('student_profiles')
            .insert({
                user_id: authData.user.id
            })

        // Award welcome achievement
        try {
            await supabase.rpc('award_achievement', {
                p_user_id: authData.user.id,
                p_achievement_name: 'Welcome Aboard!'
            })
        } catch (err) {
            console.error('Achievement error:', err)
        }

        // Redirect to onboarding
        revalidatePath('/', 'layout')
        redirect('/auth/onboarding/location')
    }

    if (userError) {
        console.error('Error fetching user data:', userError)
        revalidatePath('/', 'layout')
        redirect('/auth/onboarding/location') // Changed from /select to start onboarding
    }

    const role = userData?.role || 'student'
    const onboardingCompleted = userData?.onboarding_completed || false
    const onboardingStep = userData?.onboarding_step || 0

    // If student hasn't completed onboarding, redirect to where they left off
    if (role === 'student' && !onboardingCompleted) {
        revalidatePath('/', 'layout')

        // Redirect based on onboarding step
        if (onboardingStep === 0 || onboardingStep === 1) {
            redirect('/auth/onboarding/location')
        } else if (onboardingStep === 2) {
            redirect('/auth/onboarding/school')
        } else if (onboardingStep === 3) {
            redirect('/auth/onboarding/exam-board')
        } else if (onboardingStep === 4) {
            redirect('/auth/onboarding/subjects')
        } else if (onboardingStep === 5) {
            redirect('/auth/onboarding/goals')
        } else {
            // Default to location if step is unknown
            redirect('/auth/onboarding/location')
        }
    }

    // Redirect based on role for completed onboarding
    let redirectPath = '/learn/dashboard'
    switch (role) {
        case 'admin':
            redirectPath = '/admin'
            break
        case 'contributor':
            redirectPath = '/contribute'
            break
        case 'teacher':
            redirectPath = '/dashboard'
            break
        case 'parent':
            redirectPath = '/dashboard'
            break
        case 'student':
        default:
            redirectPath = '/learn/dashboard'
            break
    }

    revalidatePath('/', 'layout')
    redirect(redirectPath)
}
