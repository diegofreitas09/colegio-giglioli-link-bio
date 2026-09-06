"use client";

import { useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

type MuralPost = {
  id: string;
  titulo: string;
  imagem_url: string | null;
  publicado: boolean;
  publicado_em: string | null;
};

const TOOL_CLASS = "giglioli-mural-runtime-tools";

function formatPublishedAt(value: string | null) {
  if (!value) return "Ainda não publicado";

  const date = new Date(value);
  const parts = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Fortaleza"
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value || "";
  return `Publicado em ${get("day")}/${get("month")}/${get("year")} às ${get("hour")}:${get("minute")}`;
}

function storagePathFromUrl(url: string | null) {
  if (!url) return null;
  const marker = "/storage/v1/object/public/mural-public/";
  const index = url.indexOf(marker);
  if (index < 0) return null;
  return decodeURIComponent(url.slice(index + marker.length));
}

export default function AdminMuralEnhancer() {
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    let posts: MuralPost[] = [];
    let disposed = false;

    async function loadPosts() {
      const { data } = await supabase
        .from("mural_posts")
        .select("id,titulo,imagem_url,publicado,publicado_em")
        .order("created_at", { ascending: false });

      posts = (data || []) as MuralPost[];
      if (!disposed) enhanceCards();
    }

    function showStatus(container: HTMLElement, message: string, kind: "info" | "success" | "error" = "info") {
      let status = container.querySelector<HTMLElement>("[data-role='photo-status']");
      if (!status) {
        status = document.createElement("span");
        status.dataset.role = "photo-status";
        status.style.fontSize = "11px";
        status.style.fontWeight = "800";
        status.style.marginLeft = "4px";
        container.appendChild(status);
      }
      status.textContent = message;
      status.style.color = kind === "success" ? "#6ee7b7" : kind === "error" ? "#fda4af" : "#bae6fd";
    }

    function matchPost(article: HTMLElement) {
      const title = article.querySelector("h4")?.textContent?.trim();
      if (!title) return null;
      const sameTitle = posts.filter((post) => post.titulo.trim() === title);
      if (sameTitle.length === 1) return sameTitle[0];

      const imgSrc = article.querySelector<HTMLImageElement>("img")?.src;
      if (imgSrc) {
        const byImage = posts.find((post) => post.imagem_url && imgSrc.includes(post.imagem_url));
        if (byImage) return byImage;
      }
      return sameTitle[0] || null;
    }

    function enhanceCards() {
      const headings = Array.from(document.querySelectorAll("h3"));
      const muralHeading = headings.find((heading) => heading.textContent?.trim() === "Gerenciar mural");
      const section = muralHeading?.closest("section");
      if (!section) return;

      const cards = Array.from(section.querySelectorAll<HTMLElement>("article"));
      for (const article of cards) {
        if (article.querySelector(`.${TOOL_CLASS}`)) continue;
        const post = matchPost(article);
        if (!post) continue;

        const tools = document.createElement("div");
        tools.className = TOOL_CLASS;
        tools.style.display = "flex";
        tools.style.flexWrap = "wrap";
        tools.style.alignItems = "center";
        tools.style.gap = "8px";
        tools.style.marginTop = "12px";
        tools.style.paddingTop = "12px";
        tools.style.borderTop = "1px solid rgba(255,255,255,.08)";

        const published = document.createElement("span");
        published.textContent = post.publicado ? formatPublishedAt(post.publicado_em) : "Ainda não publicado";
        published.style.display = "inline-flex";
        published.style.alignItems = "center";
        published.style.minHeight = "34px";
        published.style.padding = "6px 10px";
        published.style.borderRadius = "999px";
        published.style.background = post.publicado ? "rgba(16,185,129,.12)" : "rgba(148,163,184,.10)";
        published.style.border = post.publicado ? "1px solid rgba(52,211,153,.22)" : "1px solid rgba(255,255,255,.10)";
        published.style.color = post.publicado ? "#a7f3d0" : "#cbd5e1";
        published.style.fontSize = "11px";
        published.style.fontWeight = "900";

        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/jpeg,image/png,image/webp";
        input.style.display = "none";

        const replaceButton = document.createElement("button");
        replaceButton.type = "button";
        replaceButton.textContent = "Trocar foto";
        replaceButton.style.minHeight = "34px";
        replaceButton.style.padding = "6px 12px";
        replaceButton.style.borderRadius = "999px";
        replaceButton.style.border = "1px solid rgba(125,211,252,.25)";
        replaceButton.style.background = "rgba(56,189,248,.10)";
        replaceButton.style.color = "#bae6fd";
        replaceButton.style.fontSize = "11px";
        replaceButton.style.fontWeight = "900";
        replaceButton.style.cursor = "pointer";
        replaceButton.title = "Escolher uma nova foto para esta publicação";
        replaceButton.onclick = () => input.click();

        input.onchange = async () => {
          const file = input.files?.[0];
          if (!file) return;

          const allowed = ["image/jpeg", "image/png", "image/webp"];
          if (!allowed.includes(file.type)) {
            showStatus(tools, "Use JPG, PNG ou WEBP.", "error");
            input.value = "";
            return;
          }
          if (file.size > 10 * 1024 * 1024) {
            showStatus(tools, "Máximo de 10 MB.", "error");
            input.value = "";
            return;
          }

          replaceButton.disabled = true;
          replaceButton.style.opacity = ".6";
          showStatus(tools, "Enviando nova foto...", "info");

          const ext = file.name.split(".").pop()?.toLowerCase() || "webp";
          const objectPath = `mural/${Date.now()}-${crypto.randomUUID()}.${ext}`;
          const { error: uploadError } = await supabase.storage
            .from("mural-public")
            .upload(objectPath, file, { cacheControl: "3600", upsert: false });

          if (uploadError) {
            showStatus(tools, `Erro no envio: ${uploadError.message}`, "error");
            replaceButton.disabled = false;
            replaceButton.style.opacity = "1";
            input.value = "";
            return;
          }

          const newUrl = supabase.storage.from("mural-public").getPublicUrl(objectPath).data.publicUrl;
          const { error: updateError } = await supabase
            .from("mural_posts")
            .update({ imagem_url: newUrl, updated_at: new Date().toISOString() })
            .eq("id", post.id);

          if (updateError) {
            await supabase.storage.from("mural-public").remove([objectPath]);
            showStatus(tools, `Erro ao atualizar: ${updateError.message}`, "error");
            replaceButton.disabled = false;
            replaceButton.style.opacity = "1";
            input.value = "";
            return;
          }

          const oldPath = storagePathFromUrl(post.imagem_url);
          if (oldPath) await supabase.storage.from("mural-public").remove([oldPath]);

          const image = article.querySelector<HTMLImageElement>("img");
          if (image) image.src = `${newUrl}?v=${Date.now()}`;
          post.imagem_url = newUrl;
          showStatus(tools, "✓ Foto atualizada", "success");
          replaceButton.disabled = false;
          replaceButton.style.opacity = "1";
          input.value = "";
        };

        tools.appendChild(published);
        tools.appendChild(replaceButton);
        tools.appendChild(input);

        const controls = Array.from(article.querySelectorAll("div")).find((div) =>
          Array.from(div.querySelectorAll("button")).some((button) => button.textContent?.includes("Editar conteúdo"))
        );

        if (controls?.parentElement) controls.parentElement.insertBefore(tools, controls);
        else article.appendChild(tools);
      }
    }

    const observer = new MutationObserver(() => enhanceCards());
    observer.observe(document.body, { childList: true, subtree: true });
    loadPosts();

    return () => {
      disposed = true;
      observer.disconnect();
    };
  }, []);

  return null;
}
