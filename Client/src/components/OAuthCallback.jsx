import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

export default function OAuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setAccessTokenFromOAuth } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');
        if (error) {
      // OAuth failed
            console.error('OAuth error:', error);
            return 
            <div>
                <h1 style={{textAlign: "center"}}>Authentication Failed</h1>
            </div>
        }

        if (token) {
        // OAuth successful! Store the token
            setAccessTokenFromOAuth(token);
            
            // Redirect to dashboard
            navigate('/');
        } else {
            // No token, something went wrong
            return 
            <div>
                <h1 style={{textAlign: "center"}}>Authentication Failed</h1>
            </div>
        }
    }, [searchParams, navigate, setAccessTokenFromOAuth]);

    return (
        <>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh' 
            }}>
                <div style={{ textAlign: 'center' }}>
                    <h2>Completing login...</h2>
                    <p>Please wait while we finish signing you in.</p>
                </div>
            </div>
        </>
    )
}
