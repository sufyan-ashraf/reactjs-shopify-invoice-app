import { useState, useEffect } from 'react'
import Head from 'next/head'
import Store from 'store'
import data from '../data/data.json'
import { AnimatePresence } from 'framer-motion'

import Layout from '../components/layout/Layout'
import { deleteInvoice } from '../utilities/Invoices'

import dynamic from "next/dynamic";
import { userService } from './../services';

function App({ Component, pageProps, router }) {
	const [invoices, setInvoices] = useState(null)
	// const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // run auth check on initial load
        authCheck(router.asPath);

        // set authorized to false to hide page content while changing routes
        const hideContent = () => setAuthorized(false);
        router.events.on('routeChangeStart', hideContent);

        // run auth check on route change
        router.events.on('routeChangeComplete', authCheck)

        // unsubscribe from events in useEffect return function
        return () => {
            router.events.off('routeChangeStart', hideContent);
            router.events.off('routeChangeComplete', authCheck);
        }
    }, []);

    function authCheck(url) {
        // redirect to login page if accessing a private page and not logged in 
        const publicPaths = ['/login'];
        const path = url.split('?')[0];
        if (!userService.userValue && !publicPaths.includes(path)) {
            setAuthorized(false);
            router.push({
                pathname: '/login',
                query: { returnUrl: router.asPath }
            });
        } else {
            setAuthorized(true);
        }
    }

	useEffect(() => {
		if (Store.get('invoices') === undefined) {
			Store.set('invoices', data)
		}
		setInvoices(Store.get('invoices'))
	}, [setInvoices])

	function handleDelete(id, closePopup) {
		closePopup(false)
		router.push('/')
		deleteInvoice(id, invoices, setInvoices)
	}
	if(!authorized){
		return'';
	}
	return (
		<>
			<Head>
				<link rel="icon" href="/images/favicon-32x32.png" type="image/icon"/>
                <link href="//netdna.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet" />
			</Head>
			<Layout>
				<AnimatePresence exitBeforeEnter>
					<Component 
						{...pageProps} 
						invoices={invoices} 
						setInvoicesObj={setInvoices} 
						handleDelete={handleDelete}
						key={router.route}
					/>
				</AnimatePresence>
			</Layout>
		</>
	)
}

export default dynamic(() => Promise.resolve(App), {
	ssr: false,
});