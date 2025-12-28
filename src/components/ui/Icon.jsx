// src/components/ui/Icon.jsx

const { useEffect } = React;

const Icon = ({ name, size = 20, className }) => {
    // Lucide library ကို တစ်ကြိမ်သာ run စေရန်
    useEffect(() => { 
        if(window.lucide) {
            // createIcons() ကို ခေါ်ဆိုပြီး icon များကို Render လုပ်သည်
            window.lucide.createIcons(); 
        }
    }, [name]); 
    
    // <i> tag ကို သုံးပြီး data-lucide attribute ထဲမှာ icon name ကို ထည့်သွင်းသည်
    return <i data-lucide={name} style={{ width: size, height: size }} className={`inline-block ${className}`}></i>;
};
