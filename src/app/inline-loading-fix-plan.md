Fix all remaining loading indicators across the app:
- Replace all `loading-spinner`, `animate-spin`, and manual spinner usages with <Loader />.
- Set the `message` prop appropriately for the context (submitting, loading, saving, etc.)
- Loader to be used both for busy states in modals, CRUD operations, and data tables (esp. in Admin, User, Sample, Profile, and modals).
- Remove DaisyUI spinner usages (classes like loading loading-spinner), and swap for `<Loader />` with size tweaks where needed.
- Use className and message props for small or contextual loaders.
