// ===== STORE INFO (Real API) =====
const [settings, setSettings] = useState({
  storeName: '',
  storeEmail: '',
  storePhone: '',
  storeAddress: '',
  currency: 'BDT',
  whatsappNumber: ''
});
const [saving, setSaving] = useState(false);
const [loadingSettings, setLoadingSettings] = useState(true);

// Settings লোড
useEffect(() => {
  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings({
          storeName: data.store_name || 'Belal Jamaddar Enterprise',
          storeEmail: data.store_email || 'belaljamaddarenterprise@gmail.com',
          storePhone: data.store_phone || '01581427849',
          storeAddress: data.store_address || 'Your Store Address',
          currency: data.currency || 'BDT',
          whatsappNumber: data.whatsapp_number || '01581427849'
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoadingSettings(false);
    }
  };
  
  if (user) {
    fetchSettings();
  }
}, [user]);

const handleSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);
  
  try {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    
    const data = await res.json();
    
    if (res.ok) {
      alert('✅ ' + data.message);
    } else {
      alert('❌ ' + (data.message || 'Failed to save'));
    }
  } catch (error) {
    alert('❌ Server error');
  } finally {
    setSaving(false);
  }
};