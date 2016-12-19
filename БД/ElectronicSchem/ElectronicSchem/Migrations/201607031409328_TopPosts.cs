namespace ElectronicSchem.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class TopPosts : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.TopPostModels",
                c => new
                    {
                        ID = c.Long(nullable: false, identity: true),
                        PostID = c.Long(nullable: false),
                        Rating = c.Double(nullable: false),
                    })
                .PrimaryKey(t => t.ID);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.TopPostModels");
        }
    }
}
