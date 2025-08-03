"use client";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

const tableBorder = "border border-gray-300";

type SortKey = "protocol" | "asset" | "category";
type SortOrder = "asc" | "desc";

type RateEntry = {
    protocol: string;
    mint: string;
    symbol: string;
    category?: string;
    lendingRate: number;
    borrowingRate: number;
};

export default function Dashboard() {
    const [data, setData] = useState<RateEntry[]>([]);
    const [sortKey, setSortKey] = useState<SortKey | null>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

    useEffect(() => {
        fetch("/api/rates")
            .then((res) => res.json())
            .then((rows) => {
                const parsed = rows.map((row: any) => ({
                    protocol: "Kamino",
                    mint: row.mint,
                    symbol: row.symbol,
                    category: "stable",
                    lendingRate: row.rates.kamino.lendingRate,
                    borrowingRate: row.rates.kamino.borrowingRate,
                }));
                setData(parsed);
            });
    }, []);

    const sortedData = [...data].sort((a, b) => {
        if (!sortKey) return 0;
        const aValue = a[sortKey]?.toLowerCase?.() ?? "";
        const bValue = b[sortKey]?.toLowerCase?.() ?? "";
        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortOrder("asc");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
                    📊 Protocol Dashboard
                </h1>

                <Card className="rounded-2xl shadow border border-gray-300 bg-white">
                    <CardHeader className="pb-0">
                        <CardTitle className="text-xl text-blue-800">Market Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-auto p-0">
                        <Table className="text-sm border-separate border-spacing-0 text-gray-900">
                            <TableHeader className="sticky top-0 bg-white shadow">
                                <TableRow>
                                    <TableHead
                                        className={`${tableBorder} text-gray-900 cursor-pointer`}
                                        onClick={() => handleSort("protocol")}
                                    >
                                        Protocol {sortKey === "protocol" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                                    </TableHead>
                                    <TableHead
                                        className={`${tableBorder} text-gray-900 cursor-pointer`}
                                        onClick={() => handleSort("asset")}
                                    >
                                        Asset {sortKey === "asset" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                                    </TableHead>
                                    <TableHead
                                        className={`${tableBorder} text-gray-900 cursor-pointer`}
                                        onClick={() => handleSort("category")}
                                    >
                                        Category {sortKey === "category" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                                    </TableHead>
                                    <TableHead className={`${tableBorder} text-gray-900`}>
                                        Lending Rate
                                    </TableHead>
                                    <TableHead className={`${tableBorder} text-gray-900`}>
                                        Borrowing Rate
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedData.map((row, idx) => (
                                    <TableRow
                                        key={row.mint}
                                        className={idx % 2 === 0 ? "bg-blue-50" : "bg-white"}
                                    >
                                        <TableCell className={tableBorder}>{row.protocol}</TableCell>
                                        <TableCell className={tableBorder}>{row.symbol}</TableCell>
                                        <TableCell className={tableBorder}>{row.category}</TableCell>
                                        <TableCell className={tableBorder}>
                                            {(row.lendingRate * 100).toFixed(2)}%
                                        </TableCell>
                                        <TableCell className={tableBorder}>
                                            {(row.borrowingRate * 100).toFixed(2)}%
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
