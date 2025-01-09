import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { parseCookies, destroyCookie } from 'nookies';
import { decodeToken } from '../utils/decodeToken';

export function canSSRAuth<P extends { [key: string]: any }>(fn: GetServerSideProps<P>) {
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
        const cookies = parseCookies(ctx);
        const token = cookies['@nextauth.token'];

        if (!token) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            };
        }

        const user = decodeToken(token);

        // Validação adicional: Permitir acesso somente para usuários "gestão"
        if (!user || !user.isGestao) {
            return {
                redirect: {
                    destination: '/app-info',
                    permanent: false,
                },
            };
        }

        try {
            return await fn(ctx);
        } catch (err) {
            destroyCookie(ctx, '@nextauth.token');
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            };
        }
    };
}
