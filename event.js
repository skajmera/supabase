
const supabaseUrl = 'https://vmzskcnzjklypvottrlu.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtenNrY256amtseXB2b3R0cmx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgzMDYwMjcsImV4cCI6MjA0Mzg4MjAyN30.SWExr_AGqXbbG_UahwR5YlaZihx7ohjaO7MIn5rkVNY"

const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const supabase = createClient(supabaseUrl, supabaseKey);

// Route to insert data
app.post('/create', async (req, res) => {
    const { data, error } = await supabase.from('product').insert([
        { name: 'product 4' },
        { name: 'product 5' },
    ]).select();
    
    console.log('Inserted Data:', data);
    if (error) {
        console.log("Error:", error);
    }
    res.send("Data inserted");
});


app.get('/get', async (req, res) => {
    const { data, error } = await supabase.from("product")
      .select(`
        id,
        name,
        email
      `);
    
    console.log('Inserted Data:', data);
    if (error) {
        console.log("Error:", error);
    }
    res.json(data);
});


// Persistent Realtime Subscription
const productChannel = supabase
    .channel('public:product')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'product' }, (payload) => {
        console.log('New Insert:', payload);
    })
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'product' }, (payload) => {
        console.log('Data Updated:', payload);
    })
    .subscribe();

// Keep the server running to maintain WebSocket connection
app.listen(3001, () => console.log("Server is running on port 3001"));
