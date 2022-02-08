import joplin from 'api';
import { setupPlugin } from './scripts/setupPlugin'

joplin.plugins.register({
	onStart: async function() {
		await setupPlugin();
	}

});
