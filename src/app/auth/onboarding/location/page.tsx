'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { MapPin, Search, Globe, Loader2 } from 'lucide-react';
import { AFRICAN_COUNTRIES, getPopularCountries } from '@/types/onboarding';

export default function LocationSelectionPage() {
    const router = useRouter();
    const supabase = createClient();

    const [loading, setLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true); // Add auth check loading state
    const [userId, setUserId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Get authenticated user
        const getUser = async () => {
            console.log('[Location Page] Checking authentication...');

            try {
                // Try to get session first (more reliable after OAuth)
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    console.error('[Location Page] Session error:', sessionError);
                }

                if (session && session.user) {
                    console.log('[Location Page] Session found for user:', session.user.email);
                    setUserId(session.user.id);
                    setCheckingAuth(false);
                    return;
                }

                console.log('[Location Page] No session, checking user...');
                // Fallback to getUser
                const { data: { user }, error: userError } = await supabase.auth.getUser();

                if (userError) {
                    console.error('[Location Page] Auth error:', userError);
                }

                if (user) {
                    console.log('[Location Page] User authenticated:', user.email);
                    setUserId(user.id);
                    setCheckingAuth(false);
                    return;
                }

                console.log('[Location Page] No user found, redirecting to signup in 3 seconds...');
                // Wait longer for session to propagate
                setTimeout(() => {
                    router.push('/auth/signup/student');
                }, 3000);
            } catch (err) {
                console.error('[Location Page] Unexpected error:', err);
                setCheckingAuth(false);
            }
        };

        getUser();
    }, [router, supabase]);

    // Show loading state while checking auth
    if (checkingAuth) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    const popularCountries = getPopularCountries();
    const allCountries = AFRICAN_COUNTRIES;

    const filteredCountries = allCountries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCountrySelect = (countryCode: string) => {
        setSelectedCountry(countryCode);
        setSelectedRegion(''); // Reset region when country changes
    };

    const handleContinue = async () => {
        if (!selectedCountry) {
            setError('Please select a country');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const countryData = allCountries.find(c => c.code === selectedCountry);

            if (!userId) {
                throw new Error('User not authenticated');
            }

            // Create or update student profile with location
            const { error: profileError } = await supabase
                .from('student_profiles')
                .upsert({
                    user_id: userId,
                    country: countryData?.name,
                    region: selectedRegion || null,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'user_id'
                });

            if (profileError) throw profileError;

            // Update onboarding step
            await supabase
                .from('users')
                .update({ onboarding_step: 2 })
                .eq('id', userId);

            // Track analytics
            await supabase.from('onboarding_analytics').insert({
                user_id: userId,
                step: 2,
                step_name: 'location',
                completed_at: new Date().toISOString()
            });

            // Redirect to school selection
            router.push('/auth/onboarding/school');
        } catch (err: any) {
            console.error('Location selection error:', err);
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = () => {
        router.push('/auth/onboarding/school');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-green-50 flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 -left-20 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 -right-20 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
            </div>

            <div className="w-full max-w-2xl relative">
                {/* Progress indicator */}
                <div className="mb-6 text-center">
                    <p className="text-sm text-gray-600 font-medium">Step 2 of 6</p>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500" style={{ width: '33.33%' }}></div>
                    </div>
                </div>

                {/* Main card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-4">
                            <MapPin className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 font-['Poppins']">
                            Where Are You From?
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Help us personalize your learning experience
                        </p>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Search bar */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search for your country..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>
                    </div>

                    {/* Popular countries */}
                    {!searchTerm && (
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <Globe className="w-4 h-4" />
                                Popular Countries
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {popularCountries.map((country) => (
                                    <button
                                        key={country.code}
                                        onClick={() => handleCountrySelect(country.code)}
                                        className={`p-3 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${selectedCountry === country.code
                                            ? 'border-green-500 bg-green-50'
                                            : 'border-gray-200 hover:border-green-300'
                                            }`}
                                    >
                                        <div className="text-3xl mb-1">{country.flag}</div>
                                        <p className="text-xs font-medium text-gray-700 truncate">
                                            {country.name}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* All countries list */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">
                            {searchTerm ? 'Search Results' : 'All African Countries'}
                        </h3>
                        <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-xl">
                            {filteredCountries.length === 0 ? (
                                <p className="text-center py-8 text-gray-500">No countries found</p>
                            ) : (
                                filteredCountries.map((country) => (
                                    <button
                                        key={country.code}
                                        onClick={() => handleCountrySelect(country.code)}
                                        className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${selectedCountry === country.code ? 'bg-green-50' : ''
                                            }`}
                                    >
                                        <span className="text-2xl">{country.flag}</span>
                                        <span className="font-medium text-gray-900">{country.name}</span>
                                        {country.popular && (
                                            <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                                Popular
                                            </span>
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Region/Province selector (optional) */}
                    {selectedCountry && (
                        <div className="mt-6">
                            <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                                Region/Province (Optional)
                            </label>
                            <input
                                type="text"
                                id="region"
                                value={selectedRegion}
                                onChange={(e) => setSelectedRegion(e.target.value)}
                                placeholder="e.g., Harare, Lagos, Nairobi"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="mt-8 flex gap-4">
                        <button
                            onClick={handleSkip}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                        >
                            Skip for Now
                        </button>
                        <button
                            onClick={handleContinue}
                            disabled={loading || !selectedCountry}
                            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    Continue
                                    <span className="text-xl">→</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Back link */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => router.back()}
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        ← Go back
                    </button>
                </div>
            </div>
        </div>
    );
}
