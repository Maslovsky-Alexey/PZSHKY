namespace ElectronicSchem.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Categories : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.CategoryModels",
                c => new
                    {
                        ID = c.Long(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.ID);
            
            AddColumn("dbo.PostModels", "Category_ID", c => c.Long());
            CreateIndex("dbo.PostModels", "Category_ID");
            AddForeignKey("dbo.PostModels", "Category_ID", "dbo.CategoryModels", "ID");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.PostModels", "Category_ID", "dbo.CategoryModels");
            DropIndex("dbo.PostModels", new[] { "Category_ID" });
            DropColumn("dbo.PostModels", "Category_ID");
            DropTable("dbo.CategoryModels");
        }
    }
}
