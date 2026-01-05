"use client";
import Image from "next/image";
import { useState } from "react";
function SearchMovie() {
	const [movie, setMovie] = useState("");
	const [imageSrc, setImageSrc] = useState(null);

	const handlePreview = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch(
				`http://localhost:3000/api/movie?movie=${movie}`,
			);
			const { data } = await response.json();
			setImageSrc(data.Poster);
		} catch (error) {
			console.error("Error fetching image:", error);
		}
	};

	return (
		<div>
			<input
				type="text"
				value={movie}
				onChange={(e) => setMovie(e.target.value)}
				placeholder="Movie"
				className="input input-bordered w-full max-w-xs"
			/>
			<button className="btn glass" onClick={handlePreview}>
				Preview
			</button>
			{imageSrc && (
				<Image
					src={imageSrc ?? ""}
					alt="Movie"
					className="w-48 h-72 object-cover"
					width={150}
					height={226}
				/>
			)}
		</div>
	);
}
export default SearchMovie;
