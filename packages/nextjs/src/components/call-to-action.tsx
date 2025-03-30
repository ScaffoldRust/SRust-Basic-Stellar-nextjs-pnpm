import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";

export function CallToAction() {
  return (
    <section className="border-t bg-muted/50">
      <Card className="container py-16 lg:py-20 border-none rounded-none bg-inherit">
        <CardContent className="flex flex-col items-center space-y-4 text-center p-0">
          <CardTitle className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Ready to Get Started?
          </CardTitle>

          <CardDescription className="mx-auto max-w-[600px] text-muted-foreground">
            Join the growing community of developers building on Stellar with
            Scaffold Rust.
          </CardDescription>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg">
              Start Building
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              View Documentation
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
