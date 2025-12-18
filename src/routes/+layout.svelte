<script lang="ts">
	import './layout.css';
    
    import { Toaster } from "$lib/components/ui/sonner"
    let { children }: { children: any } = $props();
</script>

<Toaster position="top-right" />

{@render children?.()}
