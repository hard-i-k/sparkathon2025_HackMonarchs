import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { BarChart3, Users, Package, TrendingUp, DollarSign, Leaf } from "lucide-react";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const dummyStats = {
    totalProducts: 1247,
    totalUsers: 8934,
    totalRevenue: 234567,
    co2Saved: 1234.5,
    avgCarbonScore: 4.2,
    dynamicPricingAccuracy: 87.3
  };

  const dummyTopUsers = [
    { id: 1, name: "Alice Johnson", points: 4520, co2Saved: 89.2 },
    { id: 2, name: "Bob Smith", points: 3890, co2Saved: 76.4 },
    { id: 3, name: "Carol Davis", points: 3456, co2Saved: 68.9 },
    { id: 4, name: "David Wilson", points: 3123, co2Saved: 62.1 },
    { id: 5, name: "Eva Brown", points: 2987, co2Saved: 59.8 }
  ];

  const dummyModelLogs = [
    { id: 1, model: "Dynamic Pricing", timestamp: "2024-01-15 14:30", status: "Success", accuracy: "89.2%" },
    { id: 2, model: "Carbon Score", timestamp: "2024-01-15 14:25", status: "Success", accuracy: "92.1%" },
    { id: 3, model: "Recommendation", timestamp: "2024-01-15 14:20", status: "Success", accuracy: "85.7%" },
    { id: 4, model: "Dynamic Pricing", timestamp: "2024-01-15 14:15", status: "Warning", accuracy: "78.3%" },
    { id: 5, model: "Carbon Score", timestamp: "2024-01-15 14:10", status: "Success", accuracy: "91.8%" }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-lg">Loading admin dashboard...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-bentonville-blue">Admin Dashboard</h1>
          <Badge variant="outline" className="text-lg px-4 py-2">
            Last updated: {new Date().toLocaleTimeString()}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-gray-600">Total Products</p><p className="text-3xl font-bold text-bentonville-blue">{dummyStats.totalProducts.toLocaleString()}</p></div><Package className="h-12 w-12 text-true-blue" /></div></CardContent></Card>
          <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-gray-600">Total Users</p><p className="text-3xl font-bold text-bentonville-blue">{dummyStats.totalUsers.toLocaleString()}</p></div><Users className="h-12 w-12 text-true-blue" /></div></CardContent></Card>
          <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-gray-600">Total Revenue</p><p className="text-3xl font-bold text-bentonville-blue">${dummyStats.totalRevenue.toLocaleString()}</p></div><DollarSign className="h-12 w-12 text-true-blue" /></div></CardContent></Card>
          <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-gray-600">CO₂ Saved</p><p className="text-3xl font-bold text-green-600">{dummyStats.co2Saved} kg</p></div><Leaf className="h-12 w-12 text-green-500" /></div></CardContent></Card>
          <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-gray-600">Avg Carbon Score</p><p className="text-3xl font-bold text-yellow-600">{dummyStats.avgCarbonScore}/10</p></div><BarChart3 className="h-12 w-12 text-yellow-500" /></div></CardContent></Card>
          <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-gray-600">ML Accuracy</p><p className="text-3xl font-bold text-blue-600">{dummyStats.dynamicPricingAccuracy}%</p></div><TrendingUp className="h-12 w-12 text-blue-500" /></div></CardContent></Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Top Users by Eco Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>CO₂ Saved</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dummyTopUsers.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell><Badge variant="outline">#{index + 1}</Badge></TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.points.toLocaleString()}</TableCell>
                    <TableCell>{user.co2Saved} kg</TableCell>
                    <TableCell><Button variant="outline" size="sm">View Profile</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              ML Model Performance Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Model</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Accuracy</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dummyModelLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.model}</TableCell>
                    <TableCell>{log.timestamp}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={log.status === "Success" ? "default" : "destructive"}
                        className={log.status === "Success" ? "bg-green-500" : ""}
                      >
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{log.accuracy}</TableCell>
                    <TableCell><Button variant="outline" size="sm">View Details</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button className="bg-true-blue hover:bg-true-blue/90">Retrain Models</Button>
              <Button variant="outline">Export Analytics</Button>
              <Button variant="outline">Update Pricing</Button>
              <Button variant="outline">Generate Report</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
