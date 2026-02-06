const form = document.getElementById("coverForm");
const outputBox = document.getElementById("outputBox");
const outputText = document.getElementById("outputText");
const copyBtn = document.getElementById("copyBtn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  outputText.value = "Generating...";
  outputBox.classList.remove("hidden");

  const payload = {
    name: name.value,
    role: role.value,
    company: company.value,
    skills: skills.value,
  };

  const res = await fetch("http://localhost:3000/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  outputText.value = data.text;
});

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(outputText.value);
  alert("Copied!");
});
