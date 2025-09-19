import { BrowserRouter, Route, Routes } from 'react-router'
import ComponentsPage from './pages/page-components';
import LayoutMain from './pages/layout-main';
import HomePage from './pages/home-page';
import PhotoDetailsPage from './pages/photo-details-page';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { NuqsAdapter } from "nuqs/adapters/react-router/v7"
import { Toaster } from "sonner"

const queryClient = new QueryClient()

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<NuqsAdapter>
				<Toaster position='top-right' richColors expand />
				<BrowserRouter>
					<Routes>
						<Route element={<LayoutMain />}>
							<Route path='/componentes' element={<ComponentsPage />} />
							<Route index element={<HomePage />} />
							<Route path="/fotos/:id" element={<PhotoDetailsPage />} />
						</Route>
					</Routes>
				</BrowserRouter>
			</NuqsAdapter>
		</QueryClientProvider>
	);
}
