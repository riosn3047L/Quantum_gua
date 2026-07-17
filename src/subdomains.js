import https from 'https';

function fetchHackertarget(domain) {
  return new Promise((resolve) => {
    const url = `https://api.hackertarget.com/hostsearch/?q=${encodeURIComponent(domain)}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode !== 200 || data.includes('error')) return resolve([]);
          const subdomains = new Set();
          for (const line of data.split('\n')) {
            if (!line.trim()) continue;
            const parts = line.split(',');
            if (parts.length > 0 && parts[0].includes(domain)) {
              subdomains.add(parts[0].trim());
            }
          }
          resolve(Array.from(subdomains));
        } catch (err) { resolve([]); }
      });
    }).on('error', () => resolve([]));
  });
}

function fetchCertspotter(domain) {
  return new Promise((resolve) => {
    const url = `https://api.certspotter.com/v1/issuances?domain=${encodeURIComponent(domain)}&include_subdomains=true&expand=dns_names`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode !== 200) return resolve([]);
          const json = JSON.parse(data);
          const subdomains = new Set();
          for (const cert of json) {
            if (cert.dns_names) {
              for (const name of cert.dns_names) {
                if (name.includes(domain) && !name.includes('*')) {
                  subdomains.add(name);
                }
              }
            }
          }
          resolve(Array.from(subdomains));
        } catch (err) { resolve([]); }
      });
    }).on('error', () => resolve([]));
  });
}

export async function findSubdomains(domain) {
  const [ht, cs] = await Promise.all([
    fetchHackertarget(domain),
    fetchCertspotter(domain)
  ]);
  
  const allSubdomains = new Set([...ht, ...cs]);
  return Array.from(allSubdomains).slice(0, 50); // Limit to 50
}
