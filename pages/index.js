import { useState, useEffect } from 'react'
import Head from 'next/head'

import Main from '../components/home/Main'
import Wrapper from '../components/home/Wrapper'
import Header from '../components/home/Header'
import NoInvoices from '../components/home/NoInvoices'
import InvoicesList from '../components/home/InvoicesList'
import { server } from '../config';

import CreateInvoiceForm from '../components/form/CreateInvoiceForm'

export default function Home({setInvoicesObj }) {
	const [filter, setFilter] = useState(null)
	const [filteredInvoices, setFilteredInvoices] = useState(null)
	const [invoices, setInvoices] = useState(null)
	const [formIsOpen, setFormIsOpen] = useState(false)
	
	async function getInvoicesHandler() {
        
        const response = await fetch(`${server}/api/get-invoices`, {
            method:"GET",
            headers:{
                'Content-Type':'application/json'
            }
        });

        const response_data = await response.json();
		let api_invoices = response_data.status == 'success' ? response_data.data : [];
		setInvoices(api_invoices);
		setFilteredInvoices(api_invoices);
        // router.push('/');
    }
	
	useEffect(() => {
		if (invoices && filter) {
			setFilteredInvoices(invoices.filter((invoice) => {
				return invoice.tags.split(",").pop() === filter.toLowerCase()
			}))
		}else{
			setFilteredInvoices(invoices);
		}
	}, [filter])

	useEffect(() => {
		getInvoicesHandler();
	},[])


	return (
		<>
			<Head>
				<title>
					Invoices {filteredInvoices && 
					filteredInvoices.length !== 0 && 
					`(${filteredInvoices.length})` || 
					''} | Frontend Mentor
				</title>
			</Head>
			<Main>
				{/* <CreateInvoiceForm 
					invoices={invoices} 
					setInvoices={setInvoices}
					isOpen={formIsOpen}
					setIsOpen={setFormIsOpen}
				/> */}
				<Wrapper>
					<Header 
						invoices={filteredInvoices} 
						filter={filter} 
						setFilter={setFilter}
						setFormIsOpen={setFormIsOpen}
					/>
					{filteredInvoices?.length === 0 ? 
						<NoInvoices/> : 
						<InvoicesList invoices={filteredInvoices}/>
					}
				</Wrapper>
			</Main>
		</>
	)
}